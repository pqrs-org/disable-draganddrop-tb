VERSION_TB_60 = `ruby $(PWD)/tools/get-version.rb $(PWD)/src/for_tb_60/install.rdf`

all:
	@mkdir -p xpi

for_tb_60:
	@mkdir -p xpi
	(cd src/for_tb_60 && zip -r ../../xpi/disable_dnd_tb-$(VERSION_TB_60).xpi *)
