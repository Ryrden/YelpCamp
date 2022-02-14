const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/CatchAsync");
const {requireLogIn, isCampAuthor, validateCampground} = require("../utils/middleware");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		requireLogIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

router.get("/new", requireLogIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(
		requireLogIn,
		isCampAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	)
	.delete(requireLogIn, isCampAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", requireLogIn, isCampAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
