const express = require('express');
const { inviteCollaborator, removeCollaborator, updateCollaboratorPermissions } = require('../controllers/collaboration');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/invite', auth, inviteCollaborator);
router.post('/remove', auth, removeCollaborator);
router.patch('/permissions', auth, updateCollaboratorPermissions);

module.exports = router;