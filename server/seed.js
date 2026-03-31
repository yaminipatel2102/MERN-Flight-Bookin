import mongoose from 'mongoose';
import { Flight } from './schemas.js';

const mongoURI = process.env.MONGO_URI || 'mongodb://db:27017/FlightBookingMERN';

mongoose.connect(mongoURI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    const dummyFlight1 = new Flight({
        flightName: 'Air India',
        flightId: 'AI-101',
        origin: 'Mumbai',
        destination: 'Delhi',
        departureTime: '10:00',
        arrivalTime: '12:00',
        basePrice: 5000,
        totalSeats: 150
    });

    const dummyFlight2 = new Flight({
        flightName: 'IndiGo Express',
        flightId: 'IG-202',
        origin: 'Delhi',
        destination: 'Banglore',
        departureTime: '14:00',
        arrivalTime: '16:30',
        basePrice: 4500,
        totalSeats: 180
    });

    // Clear previous if any
    await Flight.deleteMany({});
    
    // Add flights
    await dummyFlight1.save();
    await dummyFlight2.save();
    
    console.log('Seed completed successfully. Added 2 flights!');
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});
