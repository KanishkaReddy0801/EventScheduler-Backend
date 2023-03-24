const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const cors = require("cors")
const Event = require('./models/events')

const app = express();

app.use(cors())
app.use(bodyparser.json())

mongoose.connect('mongodb://localhost/eventScheduler', {
    useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Failed to Connect to MongoDB')
})

app.get('/', async(req, res) => {
    try {
        const events = await Event.find()
        res.json(events)
    } catch (err) {
        console.error('Failed to get events', err)
        res.status(500).json({ message: 'Failed to get events' })
    }
})

app.get('/:eventId', async(req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json(event)
    } catch (err) {
        console.error(`Failed to get event ${req.params.eventId}`, err)
        res.status(500).json({ message: `Failed to get event ${req.params.eventId}` })
    }
})

app.post('/', async (req, res) => {
    try {
        const {title, description, location, startDate, endDate } = req.body
        const event = new Event({
            title,
            description,
            location,
            startDate,
            endDate
        })
        await event.save()
        res.status(201).json({ message: 'Event created successfully' })
    } catch (err) {
        console.error('Failed to create event', err)
        res.status(500).json({ message: 'Failed to create event' })
    }
})

app.put('/:eventId', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, {new: true })
        if (!event) {
            return res.status(404).json({ message: 'Event not Found'})
        }
        res.json({ message: 'Event updated successfully', event })
    } catch (err) {
        console.error(`Failed to update event ${req.params.eventId}`, err)
        res.status(500).json({ message: `Failed to update event ${req.params.eventId}` })
    }
})

app.delete('/:eventId', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.eventId)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json({ message: 'Event deleted successfully' })
    } catch (err) {
        console.error(`Failed to delete event ${req.params.eventId}`, err)
        res.status(500).json({ message: `Failed to delete event ${req.params.eventId}` })
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})