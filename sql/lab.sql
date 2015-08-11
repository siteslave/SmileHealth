select lh.hn, lh.vn, lh.lab_order_number,
lo.lab_items_code, lo.lab_order_result, li.lab_items_name, li.lab_items_unit
from lab_head as lh
inner join lab_order as lo on lo.lab_order_number=lh.lab_order_number
inner join lab_items as li on li.lab_items_code=lo.lab_items_code

where length(lo.lab_order_result) > 0
and lh.vn in ('550725103549', '551017135427', '580226132626')
