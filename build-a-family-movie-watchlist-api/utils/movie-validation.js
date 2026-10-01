export function validateMovieUpdates({ title, genre, watched}) {
    const updates= {};

    if (title !== undefined) {
        if (typeof title !== "string") {
            return null;
        }
        updates.title = title;
    }

    if (genre !== undefined) {
        if (typeof genre !== "string") {
            return null;
        }
        updates.genre = genre;
    }

    if (watched !== undefined) {
        if (typeof watched !== "boolean") {
            return null;
        }
        updates.watched = watched;
    }

    return Object.keys(updates).length > 0 ? updates : null;
}