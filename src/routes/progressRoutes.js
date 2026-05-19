const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  completeProblem,
  uncompleteProblem,
  recordAttempt,
  openTopic,
  toggleSubtopic,
  getProgress,
} = require("../controllers/progressController");

const router = express.Router();

// All progress routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/progress/problems/{problemId}/complete:
 *   post:
 *     summary: Mark a problem as completed
 *     tags: [Progress]
 *     description: >
 *       Adds the given problem ID to the user's solvedProblems list (idempotent —
 *       calling it again for the same problem is safe). Requires authentication.
 *       In Swagger UI, log in via POST /api/auth/login first.
 *     parameters:
 *       - in: path
 *         name: problemId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Positive integer ID of the problem to mark as solved
 *         example: 5
 *     responses:
 *       200:
 *         description: Problem marked as completed (or was already marked)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid problemId (not a positive integer)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getProgress);
router.get("/snapshot", getProgress);
router.post("/problems/:problemId/complete", completeProblem);
router.post("/problems/:problemId/uncomplete", uncompleteProblem);
router.post("/problems/:problemId/attempt", recordAttempt);
router.post("/topics/:topicId/open", openTopic);
router.post("/topics/:topicId/subtopics/:subtopicId", toggleSubtopic);

module.exports = router;
