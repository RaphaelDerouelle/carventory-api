import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVehicule = async (req: Request, res: Response) => {
  try {
    const {
      privateVehicule,
      plate,
      name,
      brand,
      model,
      year,
      pictureUrl,
      lastChecked,
      lastStarted,
      lastMaintenance,
      km,
      status,
      atCompany,
      location,
      loanedTo,
      companyId
    } = req.body;

    const vehicule = await prisma.vehicule.create({
      data: {
        privateVehicule,
        plate,
        name,
        brand,
        model,
        year,
        pictureUrl,
        lastChecked,
        lastStarted,
        lastMaintenance,
        km,
        status,
        atCompany,
        location,
        loanedTo,
        companyId
      }
    });

    return res.status(201).json(vehicule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create vehicule' });
  }
};

// Get all vehicules for a company
export const getAllVehicules = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const vehicules = await prisma.vehicule.findMany({
      where: { companyId }
    });

    return res.status(200).json(vehicules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch vehicules' });
  }
};

// Get a specific vehicule by ID
export const getVehiculeById = async (req: Request, res: Response) => {
  try {
    const vehiculeId = req.params.id;
    const vehicule = await prisma.vehicule.findUnique({
      where: { id: vehiculeId }
    });

    if (!vehicule) {
      return res.status(404).json({ error: 'Vehicule not found' });
    }

    return res.status(200).json(vehicule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch vehicule' });
  }
};

// Update a vehicule by ID
export const updateVehicule = async (req: Request, res: Response) => {
  try {
    const vehiculeId = req.params.id;
    const {
      privateVehicule,
      plate,
      name,
      brand,
      model,
      year,
      pictureUrl,
      lastChecked,
      lastStarted,
      lastMaintenance,
      km,
      status,
      atCompany,
      location,
      loanedTo
    } = req.body;

    const updatedVehicule = await prisma.vehicule.update({
      where: { id: vehiculeId },
      data: {
        privateVehicule,
        plate,
        name,
        brand,
        model,
        year,
        pictureUrl,
        lastChecked,
        lastStarted,
        lastMaintenance,
        km,
        status,
        atCompany,
        location,
        loanedTo
      }
    });

    return res.status(200).json(updatedVehicule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update vehicule' });
  }
};

// Delete a vehicule by ID
export const deleteVehicule = async (req: Request, res: Response) => {
  try {
    const vehiculeId = req.params.id;
    const deletedVehicule = await prisma.vehicule.delete({
      where: { id: vehiculeId }
    });

    return res.status(200).json(deletedVehicule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete vehicule' });
  }
};
