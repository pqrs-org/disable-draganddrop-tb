VERSION_TB_60 = `ruby $(PWD)/tools/get-version1.rb $(PWD)/src/for_tb_60/install.rdf`
VERSION_TB_68 = `ruby $(PWD)/tools/get-version2.rb $(PWD)/src/for_tb_68/manifest.json`

all: for_tb_68

for_tb_60:
	@mkdir -p xpi
	rm -f xpi/disable_dnd_tb-$(VERSION_TB_60).xpi
	(cd src/for_tb_60 && zip -r ../../xpi/disable_dnd_tb-$(VERSION_TB_60).xpi *)

for_tb_68: lint
	@mkdir -p xpi
	rm -f xpi/disable_dnd_tb-$(VERSION_TB_68).xpi
	(cd src/for_tb_68 && zip -r ../../xpi/disable_dnd_tb-$(VERSION_TB_68).xpi *)

lint:
	npm run lint
