use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub enum NodeData {
    R { value: String, name: String },
    C { value: String, name: String },
    L { value: String, name: String },
    V { value: String, name: String },
    Node {},
    Gnd {},
}

#[derive(Deserialize, Clone)]
pub struct CanvasNode {
    pub id: String,
    pub data: NodeData,
}

#[derive(Deserialize, Clone)]
pub struct CanvasEdge {
    pub target: String,
    pub source: String,
}
