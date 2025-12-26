import User from "../models/user.model.js";

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(req.body);

    if (!user.defaultAddress) {
      user.defaultAddress = user.addresses[0]._id;
    }

    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    Object.assign(address, req.body);
    await user.save();

    res.json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    if (user.defaultAddress?.toString() === req.params.addressId) {
      user.defaultAddress = user.addresses[0]?._id || null;
    }

    await user.save();

    res.json({ message: "Address removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressExists = user.addresses.id(req.params.addressId);
    if (!addressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.defaultAddress = req.params.addressId;
    await user.save();

    res.json({ defaultAddress: user.defaultAddress });
  } catch (error) {
    next(error);
  }
};
