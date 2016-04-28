VERSION = `ruby $(PWD)/tools/get-version.rb $(PWD)/src/install.rdf`

all:
	@mkdir -p xpi
	(cd src && zip -r ../xpi/disable_dnd_tb-$(VERSION).xpi *)
