"use strict";
import { getAvailableMenuService, getFinalMenuService } from "../services/menu.service.js";

export async function getFinalMenuController(req, res) {
  const [finalMenu, error] = await getFinalMenuService();

  if (error) {
    return res.status(500).json({ message: error });
  }

  return res.json(finalMenu);
}

export async function getAvailableMenuController(req, res) {
  const [availableMenu, error] = await getAvailableMenuService();

  if (error) {
    return res.status(500).json({ message: error });
  }

  return res.json(availableMenu);
}
