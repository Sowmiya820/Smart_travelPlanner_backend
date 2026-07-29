import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  time: { type: String, required: true },       // e.g., "09:00 AM"
  title: { type: String, required: true },      // e.g., "Visit Senso-ji Temple"
  description: { type: String },                // e.g., "Explore Tokyo's oldest temple"
  estimatedCostUSD: { type: Number, default: 0 },
  locationName: { type: String },
  lat: { type: Number },                        // Map pin coordinate
  lng: { type: Number },                        // Map pin coordinate
});

const DayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },        // e.g., 1, 2, 3
  date: { type: String },                       // e.g., "2026-08-10"
  theme: { type: String },                      // e.g., "Historical & Culture"
  activities: [ActivitySchema],
});

const TripSchema = new mongoose.Schema(
  {
    // Updated: Binds trip directly to the User model using ObjectId ref
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budgetUSD: { type: Number, default: 0 },
    coverImage: { type: String, default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828' },
    itinerary: [DayPlanSchema],
    packingList: [
      {
        item: { type: String },
        isPacked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true } // Auto-creates createdAt and updatedAt
);

export default mongoose.model('Trip', TripSchema);