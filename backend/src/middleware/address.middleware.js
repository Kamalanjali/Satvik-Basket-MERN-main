export const validateAddress = (req, res, next) => {
  const {
    fullName,
    phone,
    addressLine1,
    city,
    state,
    pincode,
  } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return res.status(400).json({
      message: "All required address fields must be provided",
    });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const pincodeRegex = /^\d{6}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  if (!pincodeRegex.test(pincode)) {
    return res.status(400).json({ message: "Invalid pincode" });
  }

  next();
};
