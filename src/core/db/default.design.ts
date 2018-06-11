export const defaultDesign = {
	_id: '_design/design',
	filters: {
		clinic: function(doc: { _id: string }, params?: { query?: { clinicID?: string } }) {
			// safe navigation
			if (!params) {
				return false;
			}
			if (!params.query) {
				return false;
			}
			if (!params.query.clinicID) {
				return false;
			}
			return doc._id.indexOf(params.query.clinicID) === 0;
		}.toString()
	}
};
