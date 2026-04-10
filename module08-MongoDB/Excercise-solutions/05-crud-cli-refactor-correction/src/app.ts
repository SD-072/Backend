import '#db';
import { Command } from 'commander';
import { Product } from '#models';

type ProductInputType = {
	name: string;
	price: number;
	stock: number;
	tags?: string[];
};

const program = new Command();
program
	.name('ecommerce-cli')
	.description('Simple product CRUD CLI')
	.version('1.0.0');

// CREATE
program
	.command('add')
	.description('Add a new product')
	.argument('<name>', 'Product name')
	.argument('<stock>', 'Stock quantity')
	.argument('<price>', 'Product price')
	.argument('[tags]', 'Comma-separated tags')
	.action(
		async (
			name: string,
			stockStr: string,
			priceStr: string,
			tagsStr?: string
		) => {
			console.log(
				'CLI application was called with add command with arguments:',
				{
					name,
					stockStr,
					priceStr,
					tagsStr
				}
			);
			// fill with formatted inputs
			// convert strings to numbers if needed
			const stock = +stockStr;
			const price = +priceStr;
			const tags = tagsStr?.split(',');
			// const result = await products.insertOne();
			const newProduct = await Product.create({
				name,
				price,
				stock,
				tags
			} satisfies ProductInputType);

			console.log(newProduct);
		}
	);

// READ
program
	.command('list')
	.description('List all products')
	.action(async () => {
		console.log('CLI application was called with list command');
		const allProducts = await Product.find();
		console.log(allProducts);
	});

// READ - Get product by id
program
	.command('get')
	.description('Get product by ID')
	.argument('<id>', 'Product ID')
	.action(async (id) => {
		console.log(
			'CLI application was called with get command with argument:',
			id
		);

		// search by _id using the objId
		const product = await Product.findById(id);

		console.log(product);
	});

// SEARCH - search by tags
program
	.command('search')
	.description('Search products by tag')
	.argument('<tag>', 'Product tag')
	.action(async (tag) => {
		console.log(
			'CLI application was called with search command with argument:',
			tag
		);
		const searchResults = await Product.find({ tags: tag });

		console.log(searchResults);
	});

// UPDATE
program
	.command('update')
	.description('Update a product by ID')
	.argument('<id>', 'Product ID')
	.argument('<name>', 'Product name')
	.argument('<stock>', 'Stock quantity')
	.argument('<price>', 'Product price')
	.argument('<tags>', 'Comma-separated tags')
	.action(
		async (
			id: string,
			name: string,
			stockStr: string,
			priceStr: string,
			tagsStr: string
		) => {
			console.log(
				'CLI application was called with update command with arguments:',
				{
					id,
					name,
					stockStr,
					priceStr,
					tagsStr
				}
			);

			const stock = +stockStr;
			const price = +priceStr;
			const tags = tagsStr.split(',');

			const updatedProduct = await Product.findByIdAndUpdate(
				id,
				{ name, stock, price, tags } satisfies Required<ProductInputType>,
				{ new: true }
			);

			console.log(updatedProduct);
		}
	);

// DELETE - delete product by id
program
	.command('delete')
	.description('Delete product by ID')
	.argument('<id>', 'Product ID')
	.action(async (id) => {
		console.log(
			'CLI application was called with delete command with argument:',
			id
		);

		const result = await Product.findByIdAndDelete(id);

		console.log(result);
	});

// after all commands
program.hook('postAction', () => process.exit(0));
program.parse();
