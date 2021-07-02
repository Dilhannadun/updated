const Workshop = require("./../model/Workshop");
const joiWorkshopSchema = require("./../validations/WorkshopValidations");

const createWorkshop = (workshopData) => {
  return new Promise(async (resolve, reject) => {
    try {
      //validate inputs
      await joiWorkshopSchema.validateAsync(workshopData);

      workshop = new Workshop(workshopData);
      await workshop.save();
      resolve("successfully added");
    } catch (err) {
      if (err.details[0].message) {
        reject(err.details[0].message);
      } else {
        reject(err);
      }
    }
  });
};

const viewAllWorkshops = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const workshops = await Workshop.find();
      resolve(workshops);
    } catch (err) {
      reject(err);
    }
  });
};

const viewApprovedWorkshops = async (req, res) => {
  try {
    const approvedWorkshops = await Workshop.find({ status: "reviewd" });
  
    res.status(200).json({ workshops: approvedWorkshops });
    
  } catch (error) {
    res.status(400).json({ err: error });
  }
}

const viewSpecificUserWokshops = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workshops = await Workshop.find({ PresenterRef: userId });
      resolve(workshops);
    } catch (err) {
      reject(err);
    }
  });
};

const viewSpecificById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workshop = await Workshop.find({ _id: id });
      resolve(workshop);
    } catch (err) {
      reject(err);
    }
  });
};

const deleteById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workshop = await Workshop.deleteOne({ _id: id });
      resolve(workshop);
    } catch (err) {
      reject(err);
    }
  });
};

const updateById = (id, workshopData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await joiWorkshopSchema.validateAsync(workshopData);

      const workshop = await Workshop.find({ _id: id });
      if (workshop.length === 0) {
        reject("No data found");
      } else {
        const updatedWorkshop = await Workshop.updateOne(
          { _id: id },
          {
            $set: {
              title: workshopData.title,
              description: workshopData.description,
              presentationFileURL: workshopData.presentationFileURL,
              estimatedDuration: workshopData.estimatedDuration,
              conferenceRef: workshopData.conferenceRef,
              status: workshopData.status,
              PresenterRef: workshopData.PresenterRef
            },
          }
        );
        resolve(updatedWorkshop);
      }
    } catch (err) {
      reject(err);
    }
  });
};

const updateWorkShopStatus = (id, workshopData) => {
  return new Promise(async(resolve, reject) => {
    try {
      //await joiWorkshopSchema.validateAsync(workshopData);

      let workshop = await Workshop.findById(id)

      workshop.status = workshopData.status

      const updated = await workshop.save()

      resolve(updated)

    } catch (err) {
      reject(err)
    }
  })
}

module.exports.createWorkshop = createWorkshop;
module.exports.viewAllWorkshops = viewAllWorkshops;
module.exports.viewSpecificUserWokshops = viewSpecificUserWokshops;
module.exports.viewSpecificById = viewSpecificById;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;
module.exports.viewApprovedWorkshops = viewApprovedWorkshops;
module.exports.updateWorkShopStatus = updateWorkShopStatus;
