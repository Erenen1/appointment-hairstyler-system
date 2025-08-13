## Analytics API

### Property Analytics
- Base: `/api/analytics/properties`
- GET `/list` query: `type[],category[],priceMin,priceMax,areaMin,areaMax,district[],rooms[],features[],status[],page,pageSize,sort=views|-views|clicks|-clicks|price|-price`
- GET `/stats` query: `range=7d|30d|90d, groupBy=day|week|month`
Örnek yanıt:
```json
{ "success": true, "data": { "totalProperties": 0, "activeProperties": 0, "soldProperties": 0, "rentedProperties": 0, "totals": {"views":0,"clicks":0}, "avgPrice":0, "distributions": { "type": {"Satılık":0,"Kiralık":0}, "category": {"Daire":0} } } }
```
- GET `/timeseries` query: `metric=views|clicks|favorites, range, groupBy`
Örnek yanıt:
```json
{ "success": true, "data": { "labels": ["2024-01-01"], "datasets": [ { "label": "views", "data": [0] } ] } }
```
- Events: GET/POST `/properties/:id/events`

### General Statistics
- Base: `/api/analytics`
- GET `/summary`
```json
{ "success": true, "data": { "totalProperties": 0, "totalViews": 0, "totalClicks": 0, "avgPrice": 0, "byCategory": [{ "category": "Daire", "count": 0 }] } }
```
- GET `/timeseries` query: `metric=views|clicks|avgPrice|newCustomers, range, groupBy`
- GET `/breakdowns` query: `dimension=category|type|city|district`

### Dashboard
- Base: `/api/dashboard`
- GET `/summary?range=7d|30d|90d|ytd`
```json
{ "success": true, "data": { "totals": {"totalProperties":0,"activeProperties":0,"totalCustomers":0}, "appointments": {"today":0,"thisWeek":0,"thisMonth":0}, "finance": {"income":0,"expense":0,"net":0}, "engagement": {"whatsappActiveChats":0, "topProperty": {"id":"uuid","title":"","views":0,"clicks":0} }, "range":"30d","generatedAt":"2024-01-01T10:00:00Z" } }
```
- GET `/top-properties?limit=5&range=30d&sort=views|clicks|favorites`
- GET `/upcoming-appointments?limit=5&from=today&staffId?`
- GET `/financial-overview?range=30d`

