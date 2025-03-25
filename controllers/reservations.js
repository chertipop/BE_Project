const Reservation = require('../models/Reservation');
const Car = require('../models/Car');
const Provider = require('../models/Provider');

exports.getReservations = async (req, res, next) => {
        let query;
    
        try {
            if (req.user && req.user.role !== 'admin') {
                query = Reservation.find({ user: req.user.id }).populate([{
                    path: 'car',
                    select: 'brand price pickupaddress',
                },{
                    path: 'provider',
                    select: 'name address telephoneNumber',
                }]);
            } else {
                if (req.params.carId) {
                    query = Reservation.find({ car: req.params.carId }).populate([{
                        path: 'car',
                        select: 'brand price pickupaddress',
                    },{
                            path: 'provider',
                            select: 'name address telephoneNumber',
                    }]);
                } else {
                    query = Reservation.find().populate([{
                        path: 'car',
                        select: 'brand price pickupaddress',
                    },{
                            path: 'provider',
                            select: 'name address telephoneNumber',
                    }]);
                }
            }
    
            const reservations = await query;
            res.status(200).json({ success: true, count: reservations.length, data: reservations });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Cannot find Reservation' });
        }
};
    
exports.getReservation = async (req, res, next) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: 'Reservation ID is required' });
            }
    
            const reservation = await Reservation.findById(req.params.id).populate([{
                path: 'car',
                select: 'brand price pickupaddress',
            },{
                    path: 'provider',
                    select: 'name address telephoneNumber',
            }]);
    
            if (!reservation) {
                return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
            }

            if(reservation.user.toString()!==req.user.id || req.user.role!==admin){
                res.status(400).json({success:false,message:"Cannot access this route"});
              }
    
            res.status(200).json({
                success: true,
                data: reservation,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Cannot find Reservation' });
        }
};

exports.addReservation = async (req,res,next) => {
        try {
                req.body.car = req.params.carId;

                const car = await Car.findById(req.params.carId);

                if(!car){
                        return res.status(404).json({success:false,
                                message:`No car with the id of ${req.params.carId}`
                        });
                }

                req.body.user = req.user.id;

                const existedReservation = await Reservation.find({user: req.user.id});

                if(existedReservation.length>=3 && req.user.role!=='admin'){
                        return res.status(400).json({success:false,
                                message: `The user with ID ${req.user.id} has already made 3 reservation`
                        });
                }

                const reservation = await Reservation.create(req.body);

                res.status(200).json({success:true, data: reservation});
        } catch (error) {
                console.log(error);
                return res.status(500).json({success:false,
                         message: 'Cannot create Reservation'});
        }
};

exports.updateReservation = async (req,res,next) => {
        try {
                let reservation = await Reservation.findById(req.params.id);

                if(!reservation){
                        return res.status(404).json({success:false,
                                message: `No reservation with the id of ${req.params.id}`
                        });
                }

                if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
                        return res.status(401).json({success:false,
                                message: `User ${req.user.id} is not authorized to update this reservation`
                        });
                }

                reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
                        new: true,
                        runValidators: true
                });

                res.status(200).json({success:true,data: reservation});
        } catch (error) {
                console.log(error);
                return res.status(500).json({success:false,
                        message: 'Cannot update Reservation'
                });
        }
};

exports.deleteReservation = async (req,res,next) => {
        try {
                const reservation = await Reservation.findById(req.params.id);

                if(!reservation){
                        return res.status(404).json({success:false,
                                message: `No reservation with the id of ${req.params.id}`
                        });
                }

                if(reservation.user.toString() !== req.user.id && req.user.role !=='admin'){
                        return res.status(401).json({success: false,
                                message: `User ${req.user.id} is not authorized to delete this reservation`
                        });
                }

                await reservation.deleteOne();

                res.status(200).json({success:true,data:{}});
        } catch (error) {
                console.log(error);
                return res.status(500).json({success:false,
                        message: 'Cannot delete Reservation'
                });
        }
};