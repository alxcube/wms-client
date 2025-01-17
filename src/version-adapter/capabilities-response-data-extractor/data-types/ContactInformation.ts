import type { ContactAddress } from "./ContactAddress";
import type { ContactPerson } from "./ContactPerson";

/**
 * Contact information of service.
 */
export interface ContactInformation {
  contactPerson?: ContactPerson;
  position?: string;
  address?: ContactAddress;
  telephone?: string;
  fax?: string;
  email?: string;
}
