const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, requireLogIn, isReviewAuthor} = require("../utils/middleware");
const reviews = require("../controllers/reviews");

const catchAsync = require("../utils/CatchAsync");

router.post("/", requireLogIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", requireLogIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
