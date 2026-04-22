"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FaGithub } from "react-icons/fa"
import { Trash2, Plus, ExternalLink, X } from "lucide-react"
import { ImageUploader } from "@/components/ui/ImageUploader"

export default function AdminProjectsPage() {
    const { projects, isLoading, addProject, deleteProject } = useProjects()
    const [uploadedImages, setUploadedImages] = useState<string[]>([])


    const handleImageUpload = (url: string) => {
        // Each time an image is uploaded, add its URL to the array
        setUploadedImages((prev) => [...prev, url])
    }
    // Local state for the "Add Project" form fields
    const [form, setForm] = useState({
        title: "",
        description: "",
        images: "",
        tags: "",       // User types: "React, Node.js" - we split it into array
        live_url: "",
        github_url: "",
        order_index: 0,
        my_role: "",
        key_features: "",
        purpose: "",
        project_type: "Personal",
        what_i_learned: "",
    })

    // Generic handler: updates any field by its name
    // This avoids writing 7 separate onChange handlers!
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Convert the comma-separated tags string into a clean array
        const tagsArray = form.tags
            .split(",")
            .map((tag) => tag.trim())  // Remove spaces around each tag
            .filter(Boolean)           // Remove empty strings
        const imagesArray = form.images
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)

        await addProject({
            title: form.title,
            description: form.description,
            images: uploadedImages,
            tags: tagsArray,
            live_url: form.live_url,
            github_url: form.github_url,
            order_index: Number(form.order_index),
            my_role: form.my_role,
            key_features: form.key_features,
            purpose: form.purpose,
            project_type: form.project_type,
            what_i_learned: form.what_i_learned,
        })

        // Reset the form after successful add
        setForm({
            title: "", description: "", images: "", tags: "",
            live_url: "", github_url: "", order_index: 0,
            my_role: "", key_features: "", purpose: "",
            project_type: "Personal", what_i_learned: ""
        })
        setUploadedImages([])
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 space-y-10">

            {/* Add Project Form */}
            <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
                        <Plus className="w-6 h-6" /> Add New Project
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold">Project Title *</label>
                            <Input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome App" required />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold">Description *</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="A short description of what this project does..."
                                className="w-full min-h-24 p-3 rounded-md border border-input bg-background text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Project Images</label>

                            {/* Show all uploaded image URLs */}
                            {uploadedImages.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {uploadedImages.map((url, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                                            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload another image */}
                            <ImageUploader onUpload={handleImageUpload} />
                            <p className="text-xs text-muted-foreground">
                                Upload multiple images. First image is the thumbnail.
                            </p>
                        </div>



                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Tags (comma separated)</label>
                            <Input name="tags" value={form.tags} onChange={handleChange} placeholder="React, TypeScript, Supabase" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Live URL</label>
                            <Input name="live_url" value={form.live_url} onChange={handleChange} placeholder="https://myapp.com" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold">GitHub URL</label>
                            <Input name="github_url" value={form.github_url} onChange={handleChange} placeholder="https://github.com/..." />
                        </div>

                        {/* Project Type - Dropdown */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Project Type</label>
                            <select
                                name="project_type"
                                value={form.project_type}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-input bg-background text-sm"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Client">Client</option>
                                <option value="Team">Team</option>
                                <option value="Open Source">Open Source</option>
                            </select>
                        </div>

                        {/* My Role */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Your Role</label>
                            <Input name="my_role" value={form.my_role} onChange={handleChange} placeholder="Lead Frontend Developer" />
                        </div>

                        {/* Purpose - Full width */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold">Purpose / Problem Solved</label>
                            <textarea name="purpose" value={form.purpose} onChange={handleChange}
                                placeholder="Why was this built? What problem does it solve?"
                                className="w-full min-h-20 p-3 rounded-md border border-input bg-background text-sm" />
                        </div>

                        {/* Key features */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold">Key Features</label>
                            <textarea name="key_features" value={form.key_features} onChange={handleChange}
                                placeholder="Auth system, Real-time updates, Admin dashboard..."
                                className="w-full min-h-20 p-3 rounded-md border border-input bg-background text-sm" />
                        </div>

                        {/* What I learned */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold">What I Learned</label>
                            <textarea name="what_i_learned" value={form.what_i_learned} onChange={handleChange}
                                placeholder="Key lessons, challenges overcome, new skills gained..."
                                className="w-full min-h-20 p-3 rounded-md border border-input bg-background text-sm" />
                        </div>


                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Display Order (1 = first)</label>
                            <Input name="order_index" type="number" value={form.order_index} onChange={handleChange} />
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Add Project"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Existing Projects List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Existing Projects ({projects.length})</h2>
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-row items-center justify-between p-4 gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{project.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {project.live_url && (
                                <Button asChild size="icon" variant="ghost">
                                    <a href={project.live_url} target="_blank"><ExternalLink className="w-4 h-4" /></a>
                                </Button>
                            )}
                            {project.github_url && (
                                <Button asChild size="icon" variant="ghost">
                                    <a href={project.github_url} target="_blank"><FaGithub className="w-4 h-4" /></a>
                                </Button>
                            )}
                            <Button size="icon" variant="destructive" onClick={() => deleteProject(project.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {!isLoading && projects.length === 0 && (
                    <p className="text-muted-foreground text-sm">No projects yet. Add one above!</p>
                )}
            </div>
        </div>
    )
}
