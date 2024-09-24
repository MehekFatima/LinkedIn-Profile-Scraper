// models/Profile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this points to your database connection

const Profile = sequelize.define('Profile', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.TEXT,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    location: {
        type: DataTypes.STRING,
    },
    connectionCount: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Map createdAt to created_at in the database
    updatedAt: false,
});

module.exports = Profile;
