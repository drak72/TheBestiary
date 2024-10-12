import { MODEL_MAP } from "consts";

export type ModelID = keyof typeof MODEL_MAP;

export type Description = {
  name: string;
  scientific_name: string;
  diet: string;
  habitat: string;
  size: string;
  coloration: string;
  lifespan: string;
  fun_fact: string;
  special_abilities: string;
  model: string;
  date: string;
  prompt: string;
};
