const { Workshop, User } = require("../models");
const ApiError = require("../utils/ApiError");

const createWorkshop = async (workshopBody) => {
  try {
    const newWorkshop = new Workshop(workshopBody);
    await newWorkshop.save();

    return newWorkshop;
  } catch (err) {
    console.error("Greška u createWorkshop:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const updateWorkshop = async (updatedWorkshop) => {
  const workshop = await Workshop.findByIdAndUpdate(
    updatedWorkshop._id,
    updatedWorkshop,
    {
      new: true,
    }
  );
  if (!workshop) {
    throw new ApiError(400, "No workshop found with the given ID.");
  }
  return workshop;
};

const getWorkshopById = async (workshopId) => {
  const workshop = Workshop.findById(workshopId);
  if (!workshop.workshop) {
    throw new ApiError(404, "Workshop not found");
  }
  return workshop;
};

const getAllWorkshops = async () => {
  const workshops = Workshop.find();
  if (!workshops) {
    throw new ApiError(404, "Workshops not found");
  }
  return workshops;
};

const getAllUserWorkshops = async (userId) => {
  const workshops = Workshop.find({ createdBy: userId });
  if (!workshops) {
    throw new ApiError(404, "Workshops not found for user");
  }
  return workshops;
};

const deleteWorkshop = async (workshopId) => {
  await Workshop.findByIdAndDelete( workshopId )
};

module.exports = {
  getWorkshopById,
  createWorkshop,
  getAllWorkshops,
  getAllUserWorkshops,
  updateWorkshop,
  deleteWorkshop
};
