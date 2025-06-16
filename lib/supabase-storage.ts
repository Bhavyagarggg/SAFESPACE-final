import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadFile(file: File, bucket: string, folder = "", userId?: string) {
  try {
    // Create a unique file name to avoid collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    // Save file metadata to database
    if (userId) {
      const { error: dbError } = await supabase.from("files").insert({
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        category: bucket,
      })

      if (dbError) {
        console.error("Error saving file metadata:", dbError)
        // Don't throw here, file upload was successful
      }
    }

    return {
      path: filePath,
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export async function deleteFile(path: string, bucket: string, userId?: string) {
  try {
    // Delete from storage
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    // Delete from database
    if (userId) {
      const { error: dbError } = await supabase.from("files").delete().eq("file_path", path).eq("user_id", userId)

      if (dbError) {
        console.error("Error deleting file metadata:", dbError)
      }
    }

    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

export async function listFiles(bucket: string, userId?: string) {
  try {
    if (userId) {
      // Get files from database for this user and category
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", userId)
        .eq("category", bucket)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } else {
      // Fallback to storage listing
      const { data, error } = await supabase.storage.from(bucket).list("", {
        sortBy: { column: "name", order: "asc" },
      })

      if (error) {
        throw error
      }

      return data || []
    }
  } catch (error) {
    console.error("Error listing files:", error)
    throw error
  }
}

export async function getFileUrl(path: string, bucket: string) {
  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path)

    return publicUrl
  } catch (error) {
    console.error("Error getting file URL:", error)
    throw error
  }
}

export default supabase
