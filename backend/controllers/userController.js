import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name ?? user.name;
  user.dateOfBirth = req.body.dateOfBirth ?? user.dateOfBirth;
  user.age = req.body.age ?? user.age;
  user.gender = req.body.gender ?? user.gender;
  user.bloodGroup = req.body.bloodGroup ?? user.bloodGroup;
  user.phone = req.body.phone ?? user.phone;

  user.allergies = req.body.allergies ?? user.allergies;
  user.chronicConditions =
    req.body.chronicConditions ?? user.chronicConditions;
  user.medications = req.body.medications ?? user.medications;

  user.emergencyContact =
    req.body.emergencyContact ?? user.emergencyContact;

  const updatedUser = await user.save();
  res.json(updatedUser);
};
