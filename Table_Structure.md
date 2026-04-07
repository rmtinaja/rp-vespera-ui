Database Naming Conventions

Table Naming Pattern
subproject_tablefunction_tagidentifier_fieldname

Tag Identifier
rp - Renaissance identifier

Subprojects
app, ad, ast, bpar, doc, mp, mpc, fin, gl, mc, etc.

Tablefunction
Soft Artifact Databases:
i_tables
t_tables
L_tables

Fieldname - The field / specific name of the table.

Example: 
mp_i_rp_owner - signifies this table is under rp
nvt_t_rp_stocktrans - signifies this table is under rp

i_tables
i stands for items.
Items (i) data is basically the items looked up in transaction modules.
The i_tables serve as the foundation for setup or CRUD (Create, Read, Update, Delete) modules, facilitating the encoding and storage of essential details required for t_tables (transaction modules).
Always with i_logs_table.
With Approve & Reject function.
Logs:
New - Pending
New - Reject
New - Approved
Update - Pending
Update - Reject
Updated - Approved

t_tables
t stands for transactions.
Transaction modules are where business operations are conducted and executed.
t is opposite of “l”. Permanent and cannot be changed. However some “t” table has changing fields. In this case, add “l” prefix in the respective field_name. 
t_table is the origin of l_table (ledger).
With document number and doc status.
With child (lines) and parent (headers) table.
With save and process function buttons.

l_tables
l stands for ledger.
Ledger are created after the transaction is being processed.
Occasionally, when dealing with numerous modules, the cost of joining multiple temporary or intermediary tables during runtime can be prohibitive.
Regularly updating the affected modules whenever an additional i_table or t_table is introduced into a specific process flow can be time-consuming or impractical, potentially disrupting workflow efficiency.
When introducing a new method or table, the l_table serves as genetic data, facilitating connections with multiple entities.
l_table serves as a consolidation point for multiple data during creation, ensuring minimal impact on other modules.
Ledger data are changeable.
Updating status (e.g. active, forfeited, amount settled, amount balance)


For existing database documentation:
https://docs.google.com/presentation/d/1c2OV1nUUc_ui4CtkQ4e2vKgD63Uc3Zm9FwBMInO8kT4/edit?slide=id.g2c42f80de6b_0_6#slide=id.g2c42f80de6b_0_6











