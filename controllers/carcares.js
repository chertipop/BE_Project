const Carcare = require("../models/Carcare");
const Car = require("../models/Car");

//@desc Get All Appointments
//@route GET /api/v1/carcares
//@access Public(user see only their own, Admin see all)
exports.getAppointments = async (req,res,next) => {
  let query;
  if(req.user.role !== "admin"){
    query = Carcare.find({user:req.user.id}).populate({
      path: "car",
      select: "brand seat gearType",
    });
  } else {
    query = Carcare.find().populate({
      path:"car",
      select: "brand seat gearType",
    });
  }

  try{
    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"Cannot retrieve appointments",
    });
  }
};

//@desc Get Single Appointment
//@route GET /api/v1/carcares/:id
//@access Public
exports.getAppointment = async(req,res,next) => {
  try{
    const appointment = await Carcare.findById(req.params.id).populate({
      path: "car",
      select:"brand seat gearType",
    });

    if(!appointment){
      return res.status(400).json({success:false, message: "Appointment not found"});
    }

    if(appointment.user.toString()!==req.user.id){
      res.status(400).json({success:false,message:"Cannot access this route"});
    }

    res.status(200).json({
      success:true,
      data:appointment,
    });
  } catch (error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot retrieve appointment",
    });
  }
};

//@desc Book a New Appointment
//@route POST /api/v1/carcares
//@access Private(User book their own appointments)
exports.bookAppointment = async (req,res,next) =>{
  try{
    const car = await Car.findById(req.body.car);

    if(!car){
      return res.status(400).json({
        success:false,
        message: `No car foind with ID ${req.body.car}`,
      });
    }

    const existingAppointment = await Carcare.findOne({
      car:req.body.car,
      appointmentDate:req.body.appointmentDate,
    });

    if(existingAppointment){
      return res.status(400).json({
        success: false,
        message: "This car already has an appointment at the selected time.",
      });
    }

    req.body.user = req.user.id;

    const appointment = await Carcare.create(req.body);

    res.status(200).json({
      success:true,
      data: appointment,
    });
  } catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot book appointment",
    });
  }
};

//@desc Cancle an Appointment
//@route DELETE /api/v1/carcares/:id
//@access Private (User can cancle their own appointments)
exports.cancleAppointment = async(req,res,next) =>{
  try{
    const appointment = await Carcare.findById(req.params.id);
    if(!appointment){
      return res.status(400).json({
        success:false,
        message: `No appointment found with ID ${req.params.id}`,
      });
    }

    if(appointment.user.toString()!== req.user.id && req.user.role !== "admin"){
      return res.status(401).json({
        success:false,
        message:`User${req.user.id} is not authorized to cancle this appointment`,        
      });
    }

    await appointment.deleteOne();
    res.status(200).json({success:true, message: "Appointment canceled successfully"});

  } catch(error){
    res.status(500).json({success:false, message:"Cannot cancel appointment"});
  }
};