import { UUID } from "uuid";
import { Comment } from "./Comment";

const User = {
    user_id: UUID,
    email: String,
    password: String,
    nome: String,
    token: String,
    comments: List<Comment>,
    created_at: Date,
    updated_at: Date,
};