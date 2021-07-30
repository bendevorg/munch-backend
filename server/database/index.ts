import mongoose from 'mongoose';
import logger from 'log-champ';

const DB_HOST = `mongodb://${process.env.DB_USERNAME}:${encodeURIComponent(
  process.env.DB_PASSWORD || '',
)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}
`;

// Connect to the database
mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

// Connection fails log the error
database.on('error', (err) => {
  logger.error(err);
});

// Connection ok log the success
database.once('open', () => {
  logger.info({ message: 'MongoDB connection is established.' });
});

// Connect lost log the event and try to reconnect
database.on('disconnected', () => {
  logger.warn({ message: 'MongoDB disconnected.' });
  mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
});

// Connect restablished log the event
database.on('reconnected', () => {
  logger.info({ message: 'MongoDB reconnected.' });
});

export default database;
