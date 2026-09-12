import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

function parseDate(date) {
    const isUnixTimestamp = /^\d+$/.test(date);
    return isUnixTimestamp ? new Date(Number(date)) : new Date(date);
}

function formatDateRes(date) {
    return {
        unix: date.getTime(),
        utc: date.toUTCString()
    }
}

app.get('/api', (req, res) => {
    res.status(200).json(formatDateRes(new Date()));
});

app.get('/api/:date', (req, res) => {
    const date = parseDate(req.params.date);

    if (isNaN(date.getTime())) {
        return res.status(400).json({
            error: "Invalid Date"
        });
    }

    res.status(200).json(formatDateRes(date));
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
