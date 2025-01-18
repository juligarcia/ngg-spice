use geo::{Contains, Coord, Line};
use serde::{Deserialize, Serialize};

use crate::compat::spice::lt_spice::engine::Rotation;

#[derive(Debug, Clone, Copy, PartialEq, Deserialize, Serialize)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

impl Position {
    pub fn to_string(self) -> String {
        format!("{}-{}", self.x, self.y)
    }

    pub fn eq(self, other: &Position) -> bool {
        self.x == other.x && self.y == other.y
    }

    pub fn add(self, other: Position) -> Position {
        Position {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }

    pub fn subtract(self, other: Position) -> Position {
        Position {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }

    /// Rotates a Position by an angle `theta` (in radians) around the origin.
    pub fn rotate(self, rotation: &Rotation) -> Position {
        match rotation {
            Rotation::Zero => self,
            Rotation::Ninety => Position {
                x: -self.y,
                y: self.x,
            },
            Rotation::OneEighty => Position {
                x: -self.x,
                y: -self.y,
            },
            Rotation::TwoSeventy => Position {
                x: self.y,
                y: -self.x,
            },
        }
    }

    pub fn average(start: &Position, end: &Position) -> Position {
        Position {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2,
        }
    }

    pub fn is_between(start: &Position, end: &Position, point: Position) -> bool {
        let start = Coord {
            x: start.x,
            y: start.y,
        };
        let end = Coord { x: end.x, y: end.y };
        let point = Coord {
            x: point.x,
            y: point.y,
        };

        if point.eq(&start) || point.eq(&end) {
            return true;
        }

        // Create a rectangle from start and end
        let line = Line::new(start, end);

        // Check if the point is inside the rectangle
        return line.contains(&point);
    }
}
