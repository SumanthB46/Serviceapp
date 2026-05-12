import { Request, Response } from 'express';
import { SubService } from '../../models/SubService';
import { Service } from '../../models/Service';
import { ProviderService } from '../../models/ProviderService';

// @desc    Get all sub-services (optionally filter by service)
// @route   GET /api/sub-services?service_id=xxx
// @access  Public
export const getSubServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = { isDeleted: false, status: 'active' };
    if (req.query.service_id) {
      filter.service_id = req.query.service_id as string;
    }

    // If location_id is provided, filter sub-services that are available in that location
    if (req.query.location_id && req.query.location_id !== "Select City") {
      try {
        // Validate if it's a valid ObjectId to prevent CastError crashes
        if (req.query.location_id.toString().match(/^[0-9a-fA-F]{24}$/)) {
          // Use .distinct() to get all unique sub-service IDs available in this location
          const availableSubServiceIds = await ProviderService.distinct('subservice_ids', {
            location_ids: req.query.location_id as string,
            isDeleted: false,
            is_active: true
          });

          if (availableSubServiceIds && availableSubServiceIds.length > 0) {
            filter._id = { $in: availableSubServiceIds };
          } else {
            // No providers in this location, so no sub-services should be shown
            filter._id = { $in: [] };
          }
        }
      } catch (innerError) {
        console.error("Error filtering sub-services by location:", innerError);
      }
    }

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
