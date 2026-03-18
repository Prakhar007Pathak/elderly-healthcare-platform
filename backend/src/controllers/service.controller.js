const Service = require('../models/Service');
const Caregiver = require('../models/Caregiver');


// ================= CREATE SERVICE =================
exports.createService = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(403).json({ message: "Caregiver profile not found" });
    }

    const { name, description, pricePerHour } = req.body;

    if (!name || !pricePerHour) {
      return res.status(400).json({
        message: "Name and pricePerHour are required"
      });
    }

    const service = await Service.create({
      caregiverId: caregiver._id,
      name,
      description,
      pricePerHour,
      image: req.file?.path || null
    });

    res.status(201).json(service);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL SERVICES (Marketplace) =================
exports.getAllServices = async (req, res) => {
  try {

    const services = await Service.find({ isActive: true })
      .populate({
        path: "caregiverId",
        match: {
          availability: true,
          verificationStatus: "verified"
        },
        populate: {
          path: "userId",
          select: "name"
        }
      })
      .select("-__v")
      .sort({ createdAt: -1 });

    // remove services where caregiver didn't match filter
    const filteredServices = services.filter(
      service => service.caregiverId !== null
    );

    res.status(200).json(filteredServices);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET CAREGIVER OWN SERVICES =================
exports.getMyServices = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const services = await Service.find({
      caregiverId: caregiver._id
    }).sort({ createdAt: -1 });

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= DELETE SERVICE =================
exports.deleteService = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver profile not found" });
    }

    const service = await Service.findOne({
      _id: req.params.id,
      caregiverId: caregiver._id
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found or not authorized"
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE SERVICE =================
exports.updateService = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.user.id });

    if (!caregiver) {
      return res.status(403).json({ message: "Caregiver profile not found" });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Ownership check
    if (service.caregiverId.toString() !== caregiver._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this service" });
    }

    const { name, description, pricePerHour } = req.body;

    service.name = name ?? service.name;
    service.description = description ?? service.description;
    service.pricePerHour = pricePerHour ?? service.pricePerHour;

    if (req.file) {
      service.image = req.file.path;
    }

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};