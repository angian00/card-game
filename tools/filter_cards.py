#!/usr/bin/env python3

import json

in_filename = "../data/cards.collectible.json"
out_filename = "../data/cards.filtered.json"


def main():
	with open(in_filename) as f:
		all_cards = json.load(f)


	filtered = [(c["id"], c["name"], c["text"]) for c in all_cards if \
		c["collectible"] and \
		(c["set"] == "CORE" or c["set"] == "EXPERT1") and \
		(c["rarity"] == "FREE" or c["rarity"] == "COMMON") and \
		"text" in c and \
		#c["type"] == "MINION" and \
		#has_basic_mechanics(c) and \
		True]


	#print(filtered[0])
	#print(json.dumps(filtered))

	print_output(filtered)
	print("{}/{} cards filtered".format(len(filtered), len(all_cards)))



def print_output(ff):
	for c in ff:
		print(c)


def save_output(ff):
	with open(out_filename, 'w') as f:
		for c in ff:
			json.dump(c, f)
			f.write("\n")


def has_basic_mechanics(c):
	if "mechanics" not in c:
		return True

	m = c["mechanics"]

	if "BATTLECRY" in m:
		return False
	if "DEATHRATTLE" in m:
		return False
	if "ENRAGED" in m:
		return False

	if "AURA" in m:
		return False

	if "COMBO" in m:
		return False
	if "OVERLOAD" in m:
		return False

	if "CANT_BE_TARGETED_BY_SPELLS" in m:
		return False	
	if "SPELLPOWER" in m:
		return False

	if "CHOOSE_ONE" in m:
		return False

	if "FREEZE" in m:
		return False
	
	return True


if __name__ == "__main__":
	main()
