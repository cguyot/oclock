endpoint = 'latest';

/* appel de l'API uniquement au chargement de la page.

Cela nous permet de ne pas trop user, la limitation du nombre de consultation.

*/

$.ajax({
    url: 'http://data.fixer.io/api/' + endpoint + '?access_key=' + APIKey,
    dataType: 'jsonp',
    success: function (json) {

        // test de la réponse de l'API

        if (json.success == false) {
            afficheErreur(json.error.code, json.error.info);
        } else {
            afficheConvertisseur(json.rates);
        }

    }
});


/* en cas de code d'erreur returnée par l'api, on l'affiche */

function afficheErreur(codeErreur, info) {

    $("body").toggleClass("erreur");

    $("header").html(codeErreur);

    $("#root").append("<h1> :( </h1>");

    $("#root").append("<h2> " + info + " </h2>");

}

/* Si pas d'erreur... on y va gaiement */

function afficheConvertisseur(tauxDeChange) {

    // on met à jour le tableau des devises avec les valeurs récupérées de l'API
    miseAjourTableau(tauxDeChange);

    // on affiche les éléments de la page
    afficheFormulaire();

    // on affecte les actions aux éléments de la page
    actionFormulaire();
}



/* Cette méthode prend en paramètre, la liste d'objet renvoyée par l'API

- On parcourt ce dernier et on met à jour, la valeur du taux de notre 
liste d'objet traduite en francais.

- On se base sur le code ISO pour ce faire.

*/

function miseAjourTableau(tauxDeChange) {

    $.each(tauxDeChange, function (key, value) {

        if (key in devises) {
            devises[key].value = value;
        }

    });

}


/* nous créons et affichons les éléments de la page */

function afficheFormulaire() {

    $("body").toggleClass("oclock");
    $("header").html("Convertisseur de devises");

    $("#root").append('<form id="entry">');
    $("#root").append('</form>');

    $("#entry").append('<input id="euros"  placeholder="Entrez la valeur en euros..." pattern="[0-9\\.]*">');
    $("#entry").append('<label for="devise">Indiquez la devise </label>');
    $("#entry").append('<input list="deviseList" type="text" id="devise" />');
    $("#entry").append('<datalist id="deviseList">');

    $.each(devises, function (key, value) {

        $("#deviseList").append('<option value="' + devises[key].name + '" data-code="' + key + '"> </option>');

    });

    $("#entry").append('</datalist>');
    $("#root").append('<div id="resultat"></div>');

}


/* nous ajoutons les actions et controles aux éléments injectés

- on n'autorise que les chiffre et un seul point.
- sinon on efface le champs.
- si OK on passe au calcul du convertisseur.

*/

function actionFormulaire() {

    $("#euros").keyup(function (onlyNumber) {

        if ((onlyNumber.which > 47 && onlyNumber.which < 58) || (onlyNumber.which == 190 && ($("#euros").val().indexOf(".") == $("#euros").val().lastIndexOf(".")))) {
            calcul();
        }
        else {
            $("#euros").val('');
        }

    });
   

    $("#devise").bind('input',function () {
        calcul();
    });
}


/* on calcul, met en forme et nous injectons dans le DOM */

function calcul() {

    if ($("#devise").val() != "" && $("#euros").val() != "") {
        //recuperation du code devise
        code = $('#deviseList [value="' + $("#devise").val() + '"]').data('code');
        result = $("#euros").val() * devises[code].value;

        intro = '<div class="little">Pour ' + $("#euros").val() + ' €, vous avez : </div>'
        end = '<div class="little">' + $("#devise").val() + ' </div>'

        $("#resultat").html(intro + result.toFixed(2) + end);
    }

}