select o.hn, o.vn, o.icode, o.qty,
o.unitprice, d.name as drug_name, d.units,
d.did as stdcode, ds.code as usage_code
from opitemrece as o
inner join drugitems as d on d.icode=o.icode
left join drugusage as ds on ds.drugusage=o.drugusage
where o.income='03'
and o.vn in ('580211095806', '580219134847', '580226132626')
