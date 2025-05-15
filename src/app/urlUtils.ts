export class URLUtils {

    constructor() {
        // Constructor logic if needed
    }

    static departments(args: any) {
        return `/departments/${args}`;
    }

    // Add new methods for legal inquiry form
    static submitEnquiry(uid: any) {
        return `/enquiries/${uid}`;
    }

    static uploadDocument(uid: any) {
        return `/document/upload/${uid}`;
    }

}