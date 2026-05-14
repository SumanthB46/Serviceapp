import { Provider } from '../models/Provider';
import { deleteFileFromCloud } from './fileHelper';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Cleanup job to remove expired verification documents from the filesystem and database.
 * Documents are kept for 30 days post-verification as per Urban Company safety flow.
 */
export const cleanupExpiredDocs = async () => {
  try {
    console.log('[CLEANUP] Starting KYC document cleanup task...');
    
    // Find providers whose verification docs have expired
    const expiredProviders = await Provider.find({
      verification_docs_expiry: { $lt: new Date() },
      kyc_status: 'verified',
      'verification_docs.id_proof_url': { $ne: '' }
    });

    console.log(`[CLEANUP] Found ${expiredProviders.length} providers with expired documents.`);

    for (const provider of expiredProviders) {
      console.log(`[CLEANUP] Purging documents for Provider: ${provider._id}`);
      
      // 1. Delete physical files
      if (provider.verification_docs?.public_id) {
        await deleteFileFromCloud(provider.verification_docs.public_id, provider.verification_docs.resource_type);
      } else if (provider.verification_docs?.id_proof_url) {
        // Fallback for older records
        await deleteFileFromCloud(provider.verification_docs.id_proof_url);
      }

      // 2. Clear URLs in database to reclaim storage
      provider.verification_docs = {
        id_proof_url: ''
      };

      await provider.save();
      console.log(`[CLEANUP] Successfully purged Provider: ${provider._id}`);
    }

    console.log('[CLEANUP] KYC document cleanup completed successfully.');
  } catch (error) {
    console.error('[CLEANUP] Error during document cleanup:', error);
  }
};

// If run directly
if (require.main === module) {
  connectDB().then(async () => {
    await cleanupExpiredDocs();
    process.exit(0);
  });
}
