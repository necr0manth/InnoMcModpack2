/**
 * Creates multiple Create pressing recipes from pairs of outputs and item tags.
 *
 * @param {Object} e - The recipe event object.
 * @param {Array<string>} outputs - Array of item identifiers corresponding to each input tag.
 * @param {Array<string>} inputs - Array of item tag identifiers used as recipe inputs.
 *
 * Usage example:
 *  pressingPairs(
 *      e,
 *      [
 *          "create:iron_sheet"
 *      ],
 *      [
 *          "c:ingots/iron"
 *      ]
 *  )
 * - Creates one pressing recipe for each input/output pair.
 * - Each input is converted into an item tag using itemInputTag().
 * - The output at each index is paired with the input tag at the same index.
 */
function pressingPairs(e, outputs, inputs) {
    inputs.forEach((input, i) => {
        pressing(e, itemOutput(outputs[i]), itemInputTag(input))
    })
}

/**
 * Creates multiple Create deploying recipes, optionally using Sequenced Assembly
 * for inputs with more than one required loop.
 *
 * @param {Object} e - The recipe event object.
 * @param {Array<string>} outputs - Array of item identifiers representing the recipe outputs.
 * @param {Array<string>} inputs - Array of item identifiers representing the base inputs.
 * @param {Array<string>} press - Array of item identifiers representing the items used for deployment.
 * @param {Array<number>} loop - Array defining the number of Sequenced Assembly loops for each recipe.
 *
 * Usage example:
 * const mechanism = [
 *     'createmechanisms:storage_mechanism'
 * ]
 *
 * const processor = [
 *     'ae2:engineering_processor'
 * ]
 *
 * const base = [
 *     'createmechanisms:zinc_mechanism'
 * ]
 *
 * const loop = [1, 1, 1, 4]
 *
 * sequenceDeploy(e, processor, base, mechanism, loop)
 *
 * - Creates a deploying recipe for each input/output pair.
 * - If the corresponding loop value is greater than 1, a Sequenced Assembly recipe is created.
 * - If the loop value is 1 or lower, a standard deploying recipe is created.
 * - The item specified in press is used as the deploying ingredient.
 */
function sequenceDeploy(e, outputs, inputs, press, loop) {
    inputs.forEach((input, i) => {
        if (loop && loop[i] && loop[i] > 1){
            sequenced_assembly(
                e,
                [
                    itemOutput(outputs[i]),
                ],
                itemInput(input),
                itemOutput(input),
                loop[i],
                [
                    deployingS(itemOutput(input), itemInput(input), itemInput(press[i]), false)
                ]
            )
        } else {
            deploying(e, itemOutput(outputs[i]), itemInput(input), itemInput(press[i]), true)
        }
    })
}

/**
 * Creates multiple AE2 processor recipes using Create Sequenced Assembly.
 *
 * Each recipe starts with the specified input and sequentially deploys
 * 'ae2:printed_silicon' and 'minecraft:redstone' onto it.
 *
 * @param {Object} e - The recipe event object.
 * @param {Array<string>} outputs - Array of item identifiers representing the final processor outputs.
 * @param {Array<string>} inputs - Array of item identifiers representing the initial printed circuit inputs.
 *
 * Usage example:
 * const circuit = [
 *     'ae2:printed_engineering_processor'
 * ]
 *
 * const processors = [
 *     'ae2:engineering_processor'
 * ]
 *
 * processorForge(e, processors, circuit)
 *
 * - Creates one Sequenced Assembly recipe for each input/output pair.
 * - The corresponding item in inputs is used as the starting item.
 * - 'ae2:printed_silicon' is deployed onto the item first.
 * - 'minecraft:redstone' is deployed onto the item afterward.
 * - Each recipe uses one processing loop.
 */
function processorForge(e, outputs, inputs) {
    inputs.forEach((input, i) => {
        sequenced_assembly(
            e,
            [
                itemOutput(outputs[i]),
            ],
            itemInput(input),
            itemOutput(input),
            1,
            [
                deployingS(itemOutput(input), itemInput(input), itemInput('ae2:printed_silicon'), false),
                deployingS(itemOutput(input), itemInput(input), itemInput('minecraft:redstone'), false)
            ]
        )
    })
}

/**
 * Creates multiple Enderiam-tier Sequenced Assembly recipes.
 *
 * Each recipe starts with an Enderium Plate and applies a sequence of
 * pressing, deploying, and filling operations to create the specified output.
 *
 * @param {Object} e - The recipe event object.
 * @param {Array<string>} mechanismsI - Array of item identifiers representing
 *                                      the mechanisms used as deploying inputs.
 * @param {Array<string>} mechanismsO - Array of item identifiers representing
 *                                      the final recipe outputs.
 * @param {Array<string>} transitional - Array of item identifiers representing
 *                                       the transitional items used during the
 *                                       Sequenced Assembly process.
 *
 * Usage example:
 * enderiamTier(
 *     e,
 *     [
 *         'createmechanisms:advanced_fluid_mechanism'
 *     ],
 *     [
 *         'createmechanisms:enderiam_fluid_mechanism'
 *     ],
 *     [
 *         'createmechanisms:incomplete_enderiam_fluid_mechanism'
 *     ]
 * )
 *
 * - Creates one Sequenced Assembly recipe for each mechanism.
 * - Uses 'alltheores:enderium_plate' as the starting item.
 * - Presses the transitional item.
 * - Deploys the corresponding mechanism, Enderium Gear, and Enderiam Mechanism.
 * - Fills the transitional item with 1000mb of Enderiam Fluid twice.
 * - Uses one processing loop for each recipe.
 */
function enderiamTier(e, mechanismsI, mechanismsO, transitional) {
    mechanismsI.forEach((mechanism, i) => {
        sequenced_assembly(
            e,
            [
                itemOutput(mechanismsO[i]),
            ],
            itemInput('alltheores:enderium_plate'),
            itemOutput(transitional[i]),
            1,
            [
                pressingS(itemOutput(transitional[i]), itemInput(transitional[i])),
                deployingS(itemOutput(transitional[i]), itemInput(transitional[i]), itemInput(mechanism), false),
                deployingS(itemOutput(transitional[i]), itemInput(transitional[i]), itemInput('alltheores:enderium_gear'), false),
                deployingS(itemOutput(transitional[i]), itemInput(transitional[i]), itemInput('createmechanisms:enderiam_mechanism'), false),
                fillingS(itemOutput(transitional[i]), itemInput(transitional[i]), fluidInput('createmechanisms:enderiam_fluid', 1000)),
                fillingS(itemOutput(transitional[i]), itemInput(transitional[i]), fluidInput('createmechanisms:enderiam_fluid', 1000))
            ]
        )


    })
}

/**
 * Creates multiple shaped crafting recipes for different saw tiers.
 *
 * Each recipe combines a wooden slab tag, a wooden rod tag, and a tier-specific
 * material to produce the corresponding saw.
 *
 * @param {Object} e - The recipe event object.
 * @param {Array<string>} sawTier - Array of item identifiers representing the saw outputs.
 * @param {Array<Object>} materialInput - Array of recipe ingredients representing
 *                                        the material used for each saw tier.
 *
 * Usage example:
 * sawRecipe(
 *     e,
 *     [
 *         'createmechanisms:copper_saw'
 *     ],
 *     [
 *         itemInputKey('C', 'minecraft:copper_ingot')
 *     ]
 * )
 *
 * - Creates one shaped recipe for each saw tier.
 * - Uses 'minecraft:wooden_slabs' as the A ingredient.
 * - Uses 'c:rods/wooden' as the B ingredient.
 * - Uses the corresponding materialInput as the C ingredient.
 * - Produces one saw for each recipe.
 */
function sawRecipe(e, sawTier, materialInput){
    materialInput.forEach((input, i) => {
        shaped(
            e,
            itemOutputStack(sawTier[i], 1),
            Object.assign(
                {},
                itemInputTagKey('A', 'minecraft:wooden_slabs'),
                itemInputTagKey('B', 'c:rods/wooden'),
                input
            ),
            [
                "B  ",
                "CB ",
                " CA"
            ]
        )
    })
}

/**
 * Creates both a vanilla smithing recipe and a Create sequenced assembly
 * recipe using deploying steps.
 *
 * @param {Object} e - The recipe event object.
 * @param {Object|string} output - The final recipe output item.
 * @param {Object|string} template - The smithing template item.
 * @param {Object|string} base - The base item used in the recipe and sequenced assembly.
 * @param {Object|string} addition - The item or tag applied to the base item.
 * @param {boolean} tag - Whether the addition should be treated as an item tag. Defaults to false.
 * @param {number} stack - The amount of output items produced. Defaults to 0, which uses the default output amount.
 *
 * Usage example: smithing_deploying(
 *     e,
 *     'createmechanisms:portable_chute',
 *     'createmechanisms:zinc_mechanism',
 *     'create:chute',
 *     'minecraft:iron_ingot',
 *     false,
 *     1
 * )
 *
 * - Creates a vanilla smithing recipe using the specified template, base, and addition.
 * - Creates a Create sequenced assembly using two deploying steps.
 * - The first deploying step applies the template to the base item.
 * - The second deploying step applies the addition to the base item.
 * - When tag is true, the addition is treated as an item tag.
 * - When stack is greater than 0, the specified amount of output items is produced.
 * - Removes existing recipes that produce the specified output before creating the new recipes.
 */
function smithing_deploying(e, output, template, base, addition, tag, stack) {
    tag = tag || false;
    stack = stack || 0;

    RemoveOutput(e, [output]);

    const additionInput = tag
        ? itemInputTag(addition)
        : itemInput(addition);

    const outputCount = stack > 0
        ? itemOutputStack(output, stack)
        : itemOutput(output);

    smithing(
        e,
        outputCount,
        itemInput(template),
        itemInput(base),
        additionInput
    );

    sequenced_assembly(
        e,
        [
            outputCount,
        ],
        itemInput(base),
        itemOutput(base),
        1,
        [
            deployingS(
                itemOutput(base),
                itemInput(base),
                itemInput(template),
                false
            ),
            deployingS(
                itemOutput(base),
                itemInput(base),
                additionInput,
                false
            )
        ]
    );
}

/**
 * Creates a portable base recipe using a smithing and deploying process.
 *
 * @param {Object} e - The recipe event object.
 * @param {Object|string} output - The recipe output item.
 * @param {Object|string} casing - The casing item or item tag applied to the base.
 * @param {boolean} ifTagCasing - Whether the casing should be treated as an item tag. Defaults to false.
 *
 * Usage example: portable_base_recipe(
 *     e,
 *     'createmechanisms:portable_chute',
 *     'create:andesite_casing',
 *     false
 * )
 *
 * - Uses createmechanisms:zinc_mechanism as the smithing template.
 * - Uses create:chute as the base item.
 * - Applies the specified casing to the base item.
 * - When ifTagCasing is true, casing is treated as an item tag.
 * - Internally uses smithing_deploying() to create the recipes.
 */
function portable_base_recipe(e, output, casing, ifTagCasing) {
    ifTagCasing = ifTagCasing || false;

    smithing_deploying(
        e, output, 'createmechanisms:zinc_mechanism', 'create:chute', casing, ifTagCasing, 0
    )
}

/**
 * Creates stonecutting recipes for every item contained in an item tag.
 *
 * @param {Object} e - The recipe event object.
 * @param {string} inputTag - The item tag used as the input.
 *
 * Usage example: tag_saw_converter_recipe(
 *     e,
 *     'crafting:redstone_mechanism'
 * )
 *
 * - Retrieves all items contained in the specified item tag.
 * - Creates a stonecutting recipe for each item in the tag.
 * - Uses the entire tag as the recipe input.
 * - Each item in the tag becomes the output of its corresponding recipe.
 * - Removes existing recipes that produce each generated output item.
 */
function tag_saw_converter_recipe(e, inputTag) {
    const items = Ingredient.of(`#${inputTag}`).itemIds;

    items.forEach((item) => {
        RemoveOutput(e, [item]);
        stonecutting(
            e,
            itemInputTag(inputTag),
            itemOutput(item),
        );
    });
}