import { Request, Response } from 'express';
import { SubService } from '../../models/SubService';
import { Service } from '../../models/Service';

// @desc    Get all sub-services (optionally filter by service)
// @route   GET /api/sub-services?service_id=xxx
// @access  Public
export const getSubServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, any> = { isDeleted: false };
    if (req.query.service_id) filter.service_id = req.query.service_id;

    const subServices = await SubService.find(filter)
      .populate({
        path: 'service_id',
        select: 'service_name',
        populate: {
          path: 'category_id',
          select: 'category_name'
        }
      })
      .sort({ createdAt: -1 });

    res.json(subServices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sub-service by ID
// @route   GET /api/sub-services/:id
// @access  Public
export const getSubServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const subService = await SubService.findById(req.params.id).populate({
        path: 'service_id',
        select: 'service_name',
        populate: {
          path: 'category_id',
          select: 'category_name'
        }
      });
    if (!subService) {
      res.status(404).json({ message: 'Sub-service not found' });
      return;
    }
    res.json(subService);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new sub-service
// @route   POST /api/sub-services
// @access  Private/Admin
export const createSubService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      service_id, 
      subservice_name, 
      description, 
      base_price, 
      duration, 
      variants,
      image, 
      status 
    } = req.body;


    // Verify service exists
    const serviceExists = await Service.findById(service_id);
    if (!serviceExists) {
      res.status(400).json({ message: 'Service not found' });
      return;
    }

    const subService = await SubService.create({
      service_id,
      subservice_name,
      description,
      base_price,
      duration,
      variants: variants || [],
      image,
      status,
    });


    const populated = await subService.populate({
        path: 'service_id',
        select: 'service_name',
        populate: {
          path: 'category_id',
          select: 'category_name'
        }
      });
    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a sub-service
// @route   PUT /api/sub-services/:id
// @access  Private/Admin
export const updateSubService = async (req: Request, res: Response): Promise<void> => {
  try {
    const subService = await SubService.findById(req.params.id);
    if (!subService) {
      res.status(404).json({ message: 'Sub-service not found' });
      return;
    }

    const { 
      service_id, 
      subservice_name, 
      description, 
      base_price, 
      duration, 
      variants,
      image, 
      status 
    } = req.body;


    // Verify new service exists if being changed
    if (service_id) {
      const serviceExists = await Service.findById(service_id);
      if (!serviceExists) {
        res.status(400).json({ message: 'Service not found' });
        return;
      }
      subService.service_id = service_id;
    }

    subService.subservice_name = subservice_name ?? subService.subservice_name;
    subService.description  = description  ?? subService.description;
    subService.base_price   = base_price   ?? subService.base_price;
    subService.duration     = duration     ?? subService.duration;
    subService.variants     = variants     ?? subService.variants;
    subService.image        = image        ?? subService.image;
    subService.status       = status       ?? subService.status;


    const updated = await subService.save();
    const populated = await updated.populate({
        path: 'service_id',
        select: 'service_name',
        populate: {
          path: 'category_id',
          select: 'category_name'
        }
      });
    res.json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sub-service
// @route   DELETE /api/sub-services/:id
// @access  Private/Admin
export const deleteSubService = async (req: Request, res: Response): Promise<void> => {
  try {
    const subService = await SubService.findById(req.params.id);
    if (!subService) {
      res.status(404).json({ message: 'Sub-service not found' });
      return;
    }
    subService.isDeleted = true;
    subService.status = 'inactive';
    await subService.save();
    
    res.json({ message: 'Sub-service removed (soft delete) successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
