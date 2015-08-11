select o.hn, o.vn, o.icode, d.name, o.qty, o.unitprice
from opitemrece as o
inner join nondrugitems as d on d.icode=o.icode
where o.income <> '03'
and o.vn in ('520908093003', '550508092429', '531203120135')
