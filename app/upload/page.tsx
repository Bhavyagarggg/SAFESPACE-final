"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUpload, FiFile, FiCheckCircle, FiXCircle } from "react-icons/fi"

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    setUploadSuccess(false)
    setUploadError(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".svg"],
      "video/*": [".mp4", ".mov", ".avi"],
      "audio/*": [".mp3", ".wav", ".ogg"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
    },
    maxFiles: 10,
    maxSize: 10000000, // 10MB
  })

  const handleUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    setUploadSuccess(false)
    setUploadError(false)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress(i)
      }

      // Simulate successful upload
      setUploading(false)
      setUploadSuccess(true)
    } catch (error) {
      console.error("Upload error:", error)
      setUploading(false)
      setUploadError(true)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setUploadSuccess(false)
    setUploadError(false)
  }

  const getFileTypeIcon = (file: File) => {
    const fileType = file.type

    if (fileType.startsWith("image")) {
      return <FiFile className="text-indigo-500 text-2xl" />
    } else if (fileType.startsWith("video")) {
      return <FiFile className="text-violet-500 text-2xl" />
    } else if (fileType.startsWith("audio")) {
      return <FiFile className="text-fuchsia-500 text-2xl" />
    } else if (fileType === "application/pdf") {
      return <FiFile className="text-red-500 text-2xl" />
    } else {
      return <FiFile className="text-gray-500 text-2xl" />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload Files</h1>

        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
            isDragActive ? "border-indigo-500 bg-indigo-50" : "border-indigo-300 hover:border-indigo-500"
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="text-gray-500 text-4xl mb-2" />
          <p className="text-gray-600">
            {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>

        <div className="mt-6">
          {files.length > 0 && (
            <>
              <h2 className="text-lg font-medium text-gray-700 mb-3">Files to Upload:</h2>
              <ul>
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-2 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      {getFileTypeIcon(file)}
                      <span className="text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <FiXCircle />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {uploading && (
          <div className="mt-6">
            <p className="text-gray-700 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-6 p-4 rounded-md bg-emerald-100 text-emerald-500 flex items-center space-x-2">
            <FiCheckCircle className="text-2xl" />
            <span>Files uploaded successfully!</span>
          </div>
        )}

        {uploadError && (
          <div className="mt-6 p-4 rounded-md bg-red-100 text-red-500 flex items-center space-x-2">
            <FiXCircle className="text-2xl" />
            <span>An error occurred during upload. Please try again.</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className={`mt-6 py-3 px-6 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
            files.length === 0 || uploading ? "bg-gray-400 cursor-not-allowed" : "gradient-primary hover:shadow-md"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
    </div>
  )
}

export default UploadPage
