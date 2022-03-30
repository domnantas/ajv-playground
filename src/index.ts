import Ajv, { _, KeywordCxt } from "ajv";
import { difference } from "ramda";

const ajv = new Ajv({ $data: true });

ajv.addKeyword({
	keyword: "keysFrom",
	$data: true,
	code(cxt: KeywordCxt) {
		const { data, schemaCode } = cxt;
		// I need to figure out if `data` and `schemaCode` contain the same items
		// That may be done by using difference() from Ramda
		cxt.fail$data(
			// I'm not sure what's the difference between `fail$data` and `fail`
			_`console.log('codegen', ${data}, Object.keys(${schemaCode}))`
		);
	},
});

const schema = {
	type: "object",
	properties: {
		items: {
			type: "object",
		},
		itemsOrder: {
			type: "array",
			keysFrom: { $data: "/items" },
		},
	},
};

const validate = ajv.compile(schema);

console.log(
	"valid (should be true)",
	validate({
		items: {
			one: true,
			two: true,
		},
		itemsOrder: ["two", "one"],
	})
);
console.log(
	"invalid (should be false)",
	validate({
		items: {
			one: true,
			two: true,
		},
		itemsOrder: ["two", "one", "three"],
	})
);
