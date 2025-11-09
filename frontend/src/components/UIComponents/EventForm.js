"use client";

import { useState, useEffect } from "react";
import Button from "./Button";

export default function EventForm({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    date: "",
    time: "",
    location: "",
    price: 0,
    capacity: 100,
    tags: [],
    image: null
  });

  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "Technology",
        date: initialData.date || "",
        time: initialData.time || "",
        location: initialData.location || "",
        price: initialData.price || 0,
        capacity: initialData.capacity || 100,
        tags: initialData.tags || [],
        image: initialData.image || null
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = [
    "Technology",
    "Music",
    "Food & Drink",
    "Sports & Wellness",
    "Arts & Culture",
    "Business",
    "Education",
    "Entertainment",
    "Other"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Image
        </label>
        {imagePreview ? (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-3">
            <img
              src={imagePreview}
              alt="Event preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <span className="text-6xl text-gray-400">🎉</span>
              <p className="text-gray-500 mt-2">No image uploaded</p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
          placeholder="Enter event title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
          placeholder="Describe your event"
        />
      </div>

      {/* Category and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (KES) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
            placeholder="0 for free events"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time *
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Location and Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
            placeholder="Event venue or online"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity *
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
            placeholder="Maximum attendees"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
            placeholder="Add tags to help people find your event"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" variant="primary" className="bg-black text-white hover:bg-gray-800">
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
