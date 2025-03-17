const { Workshop, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { getGfsBucket } = require("../config/db");
const stream = require("stream");

const uploadImageToGridFS = async (file, workshopId) => {
  const gfsBucket = getGfsBucket();

  const readableStream = new stream.Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
    metadata: { workshopId },
  });

  readableStream.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on("finish", () => {
      resolve(uploadStream.id);
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      reject(err);
    });
  });
};

const createWorkshop = async (workshopBody, coverImage) => {
  try {
    const newWorkshop = new Workshop(workshopBody);
    await newWorkshop.save();

    if (coverImage) {
      const imageId = await uploadImageToGridFS(coverImage, newWorkshop._id);
      newWorkshop.coverImage = imageId;
      await newWorkshop.save();
    }

    return newWorkshop;
  } catch (err) {
    console.error("Greška u createWorkshop:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const updateWorkshop = async (updatedWorkshop, coverImage) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      updatedWorkshop._id,
      updatedWorkshop,
      { new: true }
    );

    if (!workshop) {
      throw new ApiError(400, "No workshop found with the given ID.");
    }

    if (coverImage) {
      const imageId = await uploadImageToGridFS(coverImage, workshop._id);
      workshop.coverImage = imageId;
      await workshop.save();
    } else if (updatedWorkshop.coverImage === null) {
      workshop.coverImage = null;
      await workshop.save();
    }

    return workshop;
  } catch (err) {
    console.error("Greška u updateWorkshop:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const getWorkshopById = async (workshopId) => {
  const workshop = Workshop.findById(workshopId);
  if (!workshop) {
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
  const deletedWorkshop = await Workshop.findByIdAndDelete(workshopId);
  if (!deletedWorkshop) {
    throw new Error("Workshop not found");
  }
  return { message: "Workshop deleted successfully" };
};

const addWorkshopAttendee = async (workshopId, userId) => {
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) {
    throw new ApiError(404, "Workshop not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const index = workshop.attendes.indexOf(userId);

  if (index !== -1) {
    workshop.attendes.splice(index, 1);
  } else {
    workshop.attendes.push(userId);
  }

  await workshop.save();
  return workshop;
};

module.exports = {
  getWorkshopById,
  createWorkshop,
  getAllWorkshops,
  getAllUserWorkshops,
  updateWorkshop,
  deleteWorkshop,
  addWorkshopAttendee,
};
