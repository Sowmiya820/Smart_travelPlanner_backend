import Trip from '../models/Trip.js';

// @desc    Get all trips for the authenticated user
// @route   GET /api/trips
// @access  Private (Requires JWT via protect middleware)
export const getTrips = async (req, res) => {
  try {
    // Automatically uses authenticated user ID attached by middleware
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single trip by ID (with ownership check)
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    // Ownership check: Ensure the trip belongs to the logged-in user
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this trip' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, budgetUSD, itinerary, coverImage } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const newTrip = await Trip.create({
      user: req.user._id, // Automatically assign authenticated user's ID
      title,
      destination,
      startDate,
      endDate,
      budgetUSD,
      coverImage,
      itinerary: itinerary || [],
    });

    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an existing trip (with ownership check)
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    // Ownership check: Prevent editing other users' trips
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this trip' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns updated document
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedTrip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a trip (with ownership check)
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    // Ownership check: Prevent deleting other users' trips
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this trip' });
    }

    await trip.deleteOne();

    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};