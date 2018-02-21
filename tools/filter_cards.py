#!/usr/bin/env python3

import json
import os


in_filename = "../data/cards.collectible.json"
out_filename = "../data/cards.filtered.json"


def main():
	in_file_path = get_script_path() + "/" + in_filename
	with open(in_file_path) as f:
		all_cards = json.load(f)


	filtered = [c for c in all_cards if \
		c["collectible"] and \
		#c['cardClass'] == 'NEUTRAL' and
		#(c["set"] == "CORE" or c["set"] == "EXPERT1") and \
		c["set"] == "CORE" and \
		(c["rarity"] == "FREE" or c["rarity"] == "COMMON") and \
		#"text" in c and \
		#c["type"] == "MINION" and \
		(c["type"] == "MINION" or c["type"] == "SPELL") and \
		#has_only_basic_mechanics(c) and \
		(not has_advanced_mechanics(c)) and \
		True]


	save_output(filtered)
	#print_output(filtered)
	#print_json(filtered)
	print("{}/{} cards filtered".format(len(filtered), len(all_cards)))



def print_output(ff):
	for c in ff:
		print("{}|{}|{}|{}|{}".format(c["id"], c["name"], c["type"], \
			c["mechanics"] if "mechanics" in c else "-", \
			c["text"] if "text" in c else "-"))

def print_json(ff):
	for c in ff:
		print(json.dumps(c))


def save_output(ff):
	out_file_path = get_script_path() + "/" + out_filename
	with open(out_file_path, 'w') as f:
		for c in ff:
			json.dump(c, f)
			f.write("\n")
	print("Saved file: {}".format(out_file_path))


def has_only_basic_mechanics(c):
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


def has_advanced_mechanics(c):
	if "mechanics" not in c:
		return False

	m = c["mechanics"]

	if "QUEST" in m:
		return True

	if "ADAPT" in m:
		return True

	return False

def get_script_path():
	return os.path.dirname(os.path.realpath(__file__))


if __name__ == "__main__":
	main()
