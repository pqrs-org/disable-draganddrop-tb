VERSION = $(shell jq --raw-output .version < src/manifest.json)

all: lint
	@mkdir -p xpi
	rm -f xpi/disable_dnd_tb-$(VERSION).xpi
	(cd src && zip -r ../xpi/disable_dnd_tb-$(VERSION).xpi *)

install:
	pnpm install

update:
	pnpm update

audit:
	pnpm audit

lint:
	pnpm run lint

clean-xpi:
	git reset xpi
	git clean -x -d -f xpi
