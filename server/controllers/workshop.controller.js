const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { workshopService } = require("../services");

const getWorkshop = catchAsync(async (req, res) => {
  try {
    const workshop = await workshopService.getWorkshopById(
      req.params.workshopId
    );
    res.status(status.OK).json({ workshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshop", err);
  }
});

const getAllWorkshops = catchAsync(async (req, res) => {
  try {
    const workshop = await workshopService.getAllWorkshops();
    res.status(status.OK).json({ workshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshops", err);
  }
});

const getAllUserWorkshops = catchAsync(async (req, res) => {
  try {
    const workshop = await workshopService.getAllUserWorkshops(
      req.params.createdBy
    );
    res.status(status.OK).json({ workshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshops", err);
  }
});

const createWorkshop = catchAsync(async (req, res) => {
  try {
    const workshop = await workshopService.createWorkshop(req.body.workshop, req.file);
    res.status(status.CREATED).json({ workshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshop", err);
  }
});

const updateWorkshop = catchAsync(async (req, res) => {
  try {
    const workshop = await workshopService.updateWorkshop(req.body.workshop, req.file);
    res.status(status.OK).json({ workshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to update workshop", err);
  }
});

const deleteWorkshop = catchAsync(async (req, res) => {
  try {
    const resp = await workshopService.deleteWorkshop(req.params.workshopId);
    res.status(status.OK).json("")
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshop", err);
  }
});

const attendWorkshop = catchAsync(async (req, res) => {
  console.log("req.params", req.params);
  console.log("req.body", req.body);
  try {
    const updatedWorkshop = await workshopService.addWorkshopAttendee(
      req.params.workshopId,
      req.body.userId
    );
    res.status(status.OK).json({ updatedWorkshop });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get Workshop", err);
  }
});

module.exports = {
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getAllWorkshops,
  getAllUserWorkshops,
  attendWorkshop
};