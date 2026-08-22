import mongoose from 'mongoose';

const majorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameEn: String,
  field: {
    type: String,
    required: true
  },
  minMark: {
    type: Number,
    default: 0
  },
  annualCost: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 4
  },
  description: String,
  careerPaths: [String]
});

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameEn: String,
  type: {
    type: String,
    enum: ['public', 'private', 'special-law', 'colleges', 'hospital', 'international'],
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      enum: ['north', 'center', 'south'],
      required: true
    },
    address: String
  },
  website: String,
  contact: {
    phone: String,
    email: String
  },
  majors: [majorSchema],
  description: String,
  ranking: {
    national: Number,
    regional: Number
  },
  facilities: [String],
  accreditation: [String],
  scholarships: {
    military: { type: Boolean, default: false },
    teachers: { type: Boolean, default: false },
    details: String
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
universitySchema.index({ 'location.city': 1 });
universitySchema.index({ 'majors.field': 1 });
universitySchema.index({ 'majors.minMark': 1 });
universitySchema.index({ 'majors.annualCost': 1 });

const University = mongoose.model('University', universitySchema);

export default University;